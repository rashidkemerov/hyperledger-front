export const GO_CONTRACT_CODE = `package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract определяет структуру смарт-контракта
type SmartContract struct {
	contractapi.Contract
}

// Asset описывает токенизированный объект недвижимости
type Asset struct {
	ID             string             \`json:"id"\`
	Name           string             \`json:"name"\`
	Location       string             \`json:"location"\`
	TotalValue     float64            \`json:"total_value"\`
	TotalShares    int                \`json:"total_shares"\`
	PricePerShare  float64            \`json:"price_per_share"\`
	// OwnerMap хранит распределение долей: UserID -> Количество долей
	OwnerMap       map[string]int     \`json:"owner_map"\`
}

// InitLedger инициализирует леджер с тестовыми данными (опционально)
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// В реальном сценарии инициализация может быть пустой
	return nil
}

// TokenizeProperty создает новый актив (токенизирует недвижимость)
// Аргументы: id, name, location, totalValue, totalShares
func (s *SmartContract) TokenizeProperty(ctx contractapi.TransactionContextInterface, id string, name string, location string, totalValue float64, totalShares int) error {
	// Проверка существования актива
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("актив %s уже существует", id)
	}

	// Расчет цены за долю
	pricePerShare := totalValue / float64(totalShares)

	// Изначально все доли принадлежат создателю (эмитенту)
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("не удалось получить ID клиента: %v", err)
	}

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
	}

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	// Сохранение состояния в леджер
	return ctx.GetStub().PutState(id, assetJSON)
}

// TransferShare передает доли владения от одного пользователя другому
// Аргументы: assetID, recipientID, sharesToTransfer
func (s *SmartContract) TransferShare(ctx contractapi.TransactionContextInterface, assetID string, recipientID string, sharesToTransfer int) error {
	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return err
	}

	senderID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}

	// Проверка наличия долей у отправителя
	senderShares := asset.OwnerMap[senderID]
	if senderShares < sharesToTransfer {
		return fmt.Errorf("недостаточно долей для перевода. Доступно: %d, Требуется: %d", senderShares, sharesToTransfer)
	}

	// Обновление балансов
	asset.OwnerMap[senderID] = senderShares - sharesToTransfer
	asset.OwnerMap[recipientID] = asset.OwnerMap[recipientID] + sharesToTransfer

	// Если у отправителя осталось 0 долей, можно удалить ключ (опционально)
	if asset.OwnerMap[senderID] == 0 {
		delete(asset.OwnerMap, senderID)
	}

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(assetID, assetJSON)
}

// ReadAsset возвращает информацию об активе
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения из леджера: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("актив %s не существует", id)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// AssetExists проверяет наличие актива в леджере
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("ошибка чтения из леджера: %v", err)
	}
	return assetJSON != nil, nil
}

// GetAllAssets возвращает все активы (только для демонстрации, не рекомендуется для больших данных)
func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
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