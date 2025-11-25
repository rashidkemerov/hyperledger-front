export const GO_CONTRACT_CODE = `package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract определяет базовую структуру нашего чейнкода
// Мы встраиваем стандартный контракт Fabric API
type SmartContract struct {
	contractapi.Contract
}

// Asset описывает структуру данных токенизированной недвижимости
// Используем JSON теги для сериализации данных при записи в леджер
type Asset struct {
	ID             string             \`json:"id"\`              // Уникальный идентификатор актива
	Name           string             \`json:"name"\`            // Название объекта (например, "БЦ Москва-Сити")
	Location       string             \`json:"location"\`        // Физический адрес
	TotalValue     float64            \`json:"total_value"\`     // Рыночная оценка стоимости в USD
	TotalShares    int                \`json:"total_shares"\`    // Общее количество выпущенных долей (токенов)
	PricePerShare  float64            \`json:"price_per_share"\` // Цена одной доли (TotalValue / TotalShares)
	OwnerMap       map[string]int     \`json:"owner_map"\`       // Реестр владельцев: UserID -> Количество долей
	IsActive       bool               \`json:"is_active"\`       // Статус актива (активен/заморожен)
}

// InitLedger используется для начальной настройки чейнкода (опционально)
// Может создавать генезис-активы для тестирования
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// Логика инициализации, если требуется
	return nil
}

// TokenizeProperty выпускает (минтит) новый актив в сеть
// Эта функция создает запись в World State с начальным распределением долей
func (s *SmartContract) TokenizeProperty(ctx contractapi.TransactionContextInterface, id string, name string, location string, totalValue float64, totalShares int) error {
	// 1. Проверка: существует ли уже актив с таким ID
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return fmt.Errorf("ошибка при чтении леджера: %v", err)
	}
	if exists {
		return fmt.Errorf("актив с ID %s уже существует", id)
	}

	// 2. Валидация входных данных
	if totalValue <= 0 || totalShares <= 0 {
		return fmt.Errorf("стоимость и количество долей должны быть положительными")
	}

	// 3. Расчет стоимости одной доли
	pricePerShare := totalValue / float64(totalShares)

	// 4. Получение ID вызывающего транзакцию (эмитента)
	// В реальной сети это будет сертификат MSP (Membership Service Provider)
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("не удалось получить ID клиента: %v", err)
	}

	// 5. Инициализация реестра владельцев
	// Изначально 100% долей принадлежат создателю
	ownerMap := make(map[string]int)
	ownerMap[clientID] = totalShares

	asset := Asset{
		ID:            id,
		Name:          name,
		Location:      location,
		TotalValue:    totalValue,
		TotalShares:   totalShares,
		PricePerShare: pricePerShare,
		OwnerMap:      ownerMap,
		IsActive:      true,
	}

	// 6. Сериализация в JSON
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	// 7. Запись состояния в блокчейн
	// PutState сохраняет пару ключ-значение в базу данных состояния (CouchDB/LevelDB)
	return ctx.GetStub().PutState(id, assetJSON)
}

// TransferShare выполняет атомарный перевод долей владения
// Гарантирует целостность транзакции: доли списываются у отправителя и начисляются получателю
func (s *SmartContract) TransferShare(ctx contractapi.TransactionContextInterface, assetID string, recipientID string, sharesToTransfer int) error {
	// 1. Получение текущего состояния актива
	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return err
	}

	// 2. Получение ID отправителя
	senderID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}

	// 3. Проверка баланса отправителя
	senderShares := asset.OwnerMap[senderID]
	if senderShares < sharesToTransfer {
		return fmt.Errorf("недостаточно средств: у %s есть %d, требуется %d", senderID, senderShares, sharesToTransfer)
	}

	// 4. Обновление балансов (in-memory)
	asset.OwnerMap[senderID] = senderShares - sharesToTransfer
	asset.OwnerMap[recipientID] = asset.OwnerMap[recipientID] + sharesToTransfer

	// Очистка записи, если баланс стал 0 (оптимизация хранения)
	if asset.OwnerMap[senderID] == 0 {
		delete(asset.OwnerMap, senderID)
	}

	// 5. Сериализация обновленного состояния
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	// 6. Запись изменений в леджер
	// В Fabric это создает Read-Write Set, который будет проверен на этапе валидации (VSCC)
	return ctx.GetStub().PutState(assetID, assetJSON)
}

// ReadAsset возвращает полные данные об активе по его ID
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения из леджера: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("актив %s не найден", id)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// AssetExists - служебная функция для проверки наличия ключа
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("ошибка чтения: %v", err)
	}
	return assetJSON != nil, nil
}

// GetAllAssets возвращает список всех активов
// Внимание: операция ресурсоемкая (O(n)), использовать с осторожностью в продакшене
func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
	// Пустая строка в диапазоне означает "все ключи"
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var assets []*Asset
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		err = json.Unmarshal(queryResponse.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

// main запускает чейнкод как отдельный процесс внутри Docker контейнера пира
func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Ошибка создания чейнкода: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Ошибка запуска чейнкода: %s", err.Error())
	}
}
`;
