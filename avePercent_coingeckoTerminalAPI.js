"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// Function to fetch OHLCV data based on a pool address
function fetchOHLCVData(network_id, poolAddress, timeFrame) {
    return __awaiter(this, void 0, void 0, function () {
        var response, ohlcData, closingPrices, percentageIncreases, averagePercentageIncrease, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://api.geckoterminal.com/api/v2/networks/".concat(network_id, "/pools/").concat(poolAddress, "/ohlcv/").concat(timeFrame))];
                case 1:
                    response = _a.sent();
                    ohlcData = response.data.data.attributes.ohlcv_list;
                    if (ohlcData && Array.isArray(ohlcData) && ohlcData.length > 0) {
                        console.log("OHLCV Data:", ohlcData);
                        closingPrices = ohlcData.map(function (data) { return data[4]; });
                        percentageIncreases = calculatePercentageIncrease(closingPrices);
                        averagePercentageIncrease = calculateAveragePercentageIncrease(percentageIncreases);
                        console.log("Average Percentage Increase:", averagePercentageIncrease);
                    }
                    else {
                        console.error("Error: Invalid or empty OHLCV data in the response");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching OHLCV data:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to calculate percentage increase for each data point
function calculatePercentageIncrease(data) {
    var percentageIncreases = [];
    for (var i = 1; i < data.length; i++) {
        var percentageIncrease = ((data[i] - data[i - 1]) / data[i - 1]) * 100;
        percentageIncreases.push(percentageIncrease);
    }
    return percentageIncreases;
}
// Function to calculate average percentage increase using map and reduce
function calculateAveragePercentageIncrease(percentageIncreases) {
    var sum = percentageIncreases.reduce(function (acc, val) { return acc + val; }, 0);
    return sum / percentageIncreases.length;
}
// Example usage
var network_id = "solana";
var poolAddress = "5WGx6mE9Xww3ocYzSenGVQMJLCVVwK7ePnYV6cXcpJtK"; // Replace with the actual pool address
var timeFrame = "day";
fetchOHLCVData(network_id, poolAddress, timeFrame);
// fetchOHLCVData(network_id, poolAddress, timeFrame)
//   .then((ohlcData) => {
//     if (ohlcData && Array.isArray(ohlcData) && ohlcData.length > 0) {
//       console.log("OHLCV Data:", ohlcData);
//       const closingPrices = ohlcData.map((data: any) => data[4]); // Extracting closing prices
//       const percentageIncreases = calculatePercentageIncrease(closingPrices);
//       const averagePercentageIncrease =
//         calculateAveragePercentageIncrease(percentageIncreases);
//       console.log("Average Percentage Increase:", averagePercentageIncrease);
//     } else {
//       console.error("Error: Invalid or empty OHLCV data in the response");
//     }
//   })
//   .catch((error) => {
//     console.error("Error fetching OHLCV data:", error);
//   });
