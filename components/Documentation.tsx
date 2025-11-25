
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Network, Database, Layers, Lock, Server, Globe } from 'lucide-react';

export const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'usecases' | 'swagger'>('usecases');

  return (
    <div className="space-y-[30px] animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent w-fit">
            Документация
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
            Справочная информация о Hyperledger Fabric и API интерфейс.
        </p>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <Button 
            variant={activeTab === 'usecases' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('usecases')}
            className={activeTab === 'usecases' ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
            Применение Hyperledger
        </Button>
        <Button 
            variant={activeTab === 'swagger' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('swagger')}
            className={activeTab === 'swagger' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
        >
            Swagger API
        </Button>
      </div>

      {activeTab === 'usecases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            <Card className="hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <Layers className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Цепочки поставок (Supply Chain)</CardTitle>
                    <CardDescription>Отслеживание происхождения товаров</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Hyperledger Fabric позволяет создать прозрачную историю движения товаров от производителя до конечного потребителя, гарантируя подлинность и качество продукции.
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                        <Lock className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <CardTitle>Цифровая идентичность</CardTitle>
                    <CardDescription>Безопасное управление данными</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Децентрализованное управление идентификацией (DID) позволяет пользователям контролировать свои персональные данные, предоставляя доступ только к необходимой информации без посредников.
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                        <Database className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <CardTitle>Финансовые активы</CardTitle>
                    <CardDescription>Токенизация и клиринг</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Мгновенные расчеты и снижение затрат на клиринг благодаря атомарным свопам и смарт-контрактам. Токенизация недвижимости (как в этом приложении) — один из ярких примеров.
                    </p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                 <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4">
                        <Network className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <CardTitle>Приватные данные</CardTitle>
                    <CardDescription>Private Data Collections</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Уникальная особенность Fabric - возможность делиться данными только с определенными участниками канала, сохраняя конфиденциальность от остальных узлов сети.
                    </p>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="text-emerald-400" />
                        Почему Hyperledger Fabric?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <p className="text-sm text-slate-300">Модульная архитектура: подключаемые консенсусы (Raft, Kafka) и службы членства (MSP).</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <p className="text-sm text-slate-300">Производительность: параллельное выполнение транзакций и отсутствие глобального упорядочивания до коммита.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <p className="text-sm text-slate-300">Смарт-контракты на языках общего назначения: Go, Java, Node.js (в отличие от Solidity в Ethereum).</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}

      {activeTab === 'swagger' && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                        OAS 3.0
                    </Badge>
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">EstateChain API</h3>
                    <span className="text-xs text-slate-500">[ Base URL: api.estatechain.io/v1 ]</span>
                </div>
            </div>

            <div className="p-4 space-y-[10px]">
                {/* GET /assets */}
                <div className="border border-blue-200 dark:border-blue-900 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 flex items-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Badge className="bg-blue-600 hover:bg-blue-700 mr-4 w-20 justify-center">GET</Badge>
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">/assets</span>
                        <span className="ml-auto text-xs text-slate-500">Получить список всех активов</span>
                    </div>
                </div>

                {/* POST /assets/tokenize */}
                <div className="border border-emerald-200 dark:border-emerald-900 rounded-lg overflow-hidden">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 flex items-center cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 mr-4 w-20 justify-center">POST</Badge>
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">/assets/tokenize</span>
                        <span className="ml-auto text-xs text-slate-500">Создать новый актив (Tokenize)</span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 text-sm border-t border-emerald-100 dark:border-emerald-900">
                         <p className="mb-2 font-semibold dark:text-slate-300">Parameters:</p>
                         <pre className="bg-slate-900 text-slate-50 p-3 rounded-md overflow-x-auto text-xs">
{`{
  "name": "string",
  "location": "string",
  "totalValue": number,
  "totalShares": number
}`}
                         </pre>
                    </div>
                </div>

                {/* GET /assets/{id} */}
                <div className="border border-blue-200 dark:border-blue-900 rounded-lg overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 flex items-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Badge className="bg-blue-600 hover:bg-blue-700 mr-4 w-20 justify-center">GET</Badge>
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">/assets/{`{id}`}</span>
                        <span className="ml-auto text-xs text-slate-500">Получить детали актива</span>
                    </div>
                </div>

                {/* POST /assets/transfer */}
                <div className="border border-yellow-200 dark:border-yellow-900 rounded-lg overflow-hidden">
                     <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 flex items-center cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        <Badge className="bg-yellow-600 hover:bg-yellow-700 mr-4 w-20 justify-center">POST</Badge>
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">/assets/transfer</span>
                        <span className="ml-auto text-xs text-slate-500">Перевод долей</span>
                    </div>
                </div>

                 {/* DELETE /assets/{id} */}
                 <div className="border border-red-200 dark:border-red-900 rounded-lg overflow-hidden">
                     <div className="bg-red-50 dark:bg-red-900/20 p-3 flex items-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        <Badge className="bg-red-600 hover:bg-red-700 mr-4 w-20 justify-center">DELETE</Badge>
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">/assets/{`{id}`}</span>
                        <span className="ml-auto text-xs text-slate-500">Удалить актив (Admin only)</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
