# 死亡診斷整局紀錄

狀態：已實作。

- 死亡報告提供 UTF-8 JSON 下載；此檔案只供診斷，不能匯入、讀檔或繼續遊戲，死亡後原有存檔下載仍維持禁止。
- 頂層固定包含 `logSchemaVersion`、`gameVersion`、`seed`、`character`、`result`、`developerModeUsed`、`historyComplete`、`summary`、`initialState`、`timeline`、`finalState`。
- `timeline` 以遞增 `seq` 記錄樓層、節點、階段、戰鬥回合、事件類型與精簡資料；涵蓋節點進出、事件結果、固定補給、商店批次與購買、牌庫修改、戰鬥行動、消耗品、賞金與死亡。
- 純檢視、介面重繪與 JSON 序列化不得增加紀錄或消耗結果亂數。
- 紀錄隨樓層入口快照保存。讀檔時只保留入口前已完成的紀錄，當前樓層的付款、改牌、戰鬥及事件紀錄與遊戲狀態一起回退。
- 舊存檔沒有時間線時以空紀錄載入，並標示 `historyComplete: false`。
- 世人評價只輸出公開描述，不輸出隱藏數值；開發者模式只標記 `developerModeUsed`，直接改值不計入一般統計。
