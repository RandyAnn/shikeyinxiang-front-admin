// src/utils/excel.js
// Excel导出相关工具函数

/**
 * 将数据导出为Excel文件
 * @param {Array} data - 要导出的数据数组，每个元素是一个对象
 * @param {string} fileName - 导出的文件名，不包含扩展名
 * @param {string} fileType - 导出的文件类型，可选值：'csv'、'excel'，默认为'csv'
 */
export function downloadExcel(data, fileName = 'export', fileType = 'csv') {
  if (!data || !data.length) {
    console.error('导出数据为空');
    return;
  }

  try {
    // 获取所有列名
    const columns = Object.keys(data[0]);

    // 创建CSV内容
    // 添加表头，确保列名也正确处理特殊字符
    let csvContent = columns.map(column => {
      return `"${column.replace(/"/g, '""')}"`;
    }).join(',') + '\n';

    // 添加数据行
    data.forEach(item => {
      const row = columns.map(key => {
        // 处理单元格内容，确保逗号、换行符等不会破坏CSV格式
        const cellValue = item[key] === null || item[key] === undefined ? '' : item[key];

        if (typeof cellValue === 'string') {
          // 字符串类型：用双引号包裹，并将内部的双引号替换为两个双引号
          return `"${cellValue.replace(/"/g, '""')}"`;
        } else if (typeof cellValue === 'number') {
          // 数字类型：直接返回
          return cellValue;
        } else if (typeof cellValue === 'boolean') {
          // 布尔类型：转为字符串
          return cellValue ? 'true' : 'false';
        } else if (cellValue instanceof Date) {
          // 日期类型：转为ISO字符串并用引号包裹
          return `"${cellValue.toISOString()}"`;
        } else if (typeof cellValue === 'object') {
          // 对象类型：转为JSON字符串并用引号包裹
          return `"${JSON.stringify(cellValue).replace(/"/g, '""')}"`;
        } else {
          // 其他类型：转为字符串
          return `"${String(cellValue).replace(/"/g, '""')}"`;
        }
      });
      csvContent += row.join(',') + '\n';
    });

    // 添加UTF-8 BOM头，解决Excel打开中文乱码问题
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
    // 创建Blob对象，包含BOM头
    const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });

    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // 设置下载属性
    link.setAttribute('href', url);
    // 根据文件类型设置扩展名
    const extension = fileType.toLowerCase() === 'excel' ? 'xlsx' : 'csv';
    link.setAttribute('download', `${fileName}.${extension}`);
    link.style.visibility = 'hidden';

    // 添加到DOM并触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出Excel失败:', error);
    throw error;
  }
}

/**
 * 解析CSV文件内容为对象数组
 * @param {string} csvContent - CSV文件内容
 * @returns {Array} - 返回对象数组，每个对象代表一行数据
 */
export function parseCSV(csvContent) {
  if (!csvContent || typeof csvContent !== 'string') {
    return [];
  }

  try {
    // 按行分割
    const rows = csvContent.split('\n');
    if (rows.length < 2) {
      // 至少需要标题行和一行数据
      return [];
    }

    // 处理标题行
    const headers = rows[0].split(',').map(header => {
      // 去除引号和空格
      return header.trim().replace(/^"|"$/g, '');
    });

    // 处理数据行
    const result = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue; // 跳过空行

      // 处理CSV格式中的逗号和引号
      let inQuotes = false;
      let currentValue = '';
      const values = [];
      
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        
        if (char === '"' && (j === 0 || row[j-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // 添加最后一个值
      values.push(currentValue.trim());

      // 创建行对象
      const rowObject = {};
      headers.forEach((header, index) => {
        // 处理引号
        let value = values[index] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        
        rowObject[header] = value;
      });
      
      result.push(rowObject);
    }

    return result;
  } catch (error) {
    console.error('解析CSV失败:', error);
    throw error;
  }
}

export default {
  downloadExcel,
  parseCSV
};
