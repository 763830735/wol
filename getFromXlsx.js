const ExcelJS = require('exceljs');
async function getData(){
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("data.xlsx");
    const worksheet = workbook.worksheets[1];
    // 遍历工作表中具有值的所有行
    worksheet.eachRow(function(row, rowNumber) {
        if (row.values[1]===undefined){
            console.log(numberToColumnLetter(rowNumber)+":1没有值,请检查excel")
            return null
        }
        if (row.values[2]===undefined){
            console.log(numberToColumnLetter(rowNumber)+":2没有值,请检查")
            return null
        }
    });
    let className=[]
    let ip=[]
    let mac=[]
    worksheet.eachRow(function(row, rowNumber) {
        if (mac===null){
            console.log(numberToColumnLetter(rowNumber)+":2的mac格式错误,请检查")
            return null
        }
        className.push(row.values[1].trim().split(" ")[0])
        ip.push(row.values[1].trim().split(" ")[1])
        mac.push(hexStringToUint8Array(row.values[2]))
    });
    return [className,ip,mac]
}
function hexStringToUint8Array(hexString) {
    // 将字符串按照 "-" 分割成数组
    const hexArray = hexString.trim().split("-");

    if (hexArray.length!==6){
        return null
    }
    // 创建一个与字符串长度相同的 Uint8Array
    const uint8Array = new Uint8Array(hexArray.length);

    // 遍历每个分割得到的十六进制字符串
    for (let i = 0; i < hexArray.length; i++) {
        // 将十六进制字符串解析为整数值，并存储到 Uint8Array 中
        uint8Array[i] = parseInt(hexArray[i], 16);
    }

    return uint8Array;
}
function numberToColumnLetter(columnNumber) {
    let dividend = columnNumber;
    let columnName = '';
    let modulo;

    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        dividend = parseInt(((dividend - modulo) / 26).toString());
    }

    return columnName;
}

module.exports=getData