// src/utils/date.js
// 日期时间相关工具函数

/**
 * 解析时间字符串为格式化的日期时间
 * @param {string|Date} time - 时间字符串或Date对象
 * @param {string} format - 格式化模板，默认为 '{y}-{m}-{d} {h}:{i}:{s}'
 * @returns {string} - 格式化后的日期时间字符串
 */
export function parseTime(time, format = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (!time) {
    return '';
  }

  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    // 处理ISO格式的日期字符串
    if (typeof time === 'string') {
      try {
        // 尝试解析ISO格式的日期字符串
        date = new Date(time);

        // 如果日期无效，尝试其他格式
        if (isNaN(date.getTime())) {
          // 尝试解析 YYYY-MM-DD 格式
          if (/^\d{4}-\d{2}-\d{2}$/.test(time)) {
            const parts = time.split('-');
            date = new Date(parts[0], parts[1] - 1, parts[2]);
          }
          // 尝试解析 YYYY-MM-DD HH:mm:ss 格式
          else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(time)) {
            const [datePart, timePart] = time.split(' ');
            const dateParts = datePart.split('-');
            const timeParts = timePart.split(':');
            date = new Date(
              dateParts[0],
              dateParts[1] - 1,
              dateParts[2],
              timeParts[0],
              timeParts[1],
              timeParts[2]
            );
          }
        }
      } catch (e) {
        console.warn('Error parsing date string:', e);
        return time; // 如果解析出错，返回原始值
      }
    } else if (typeof time === 'number' && String(time).length === 10) {
      // 处理10位时间戳（秒）
      date = new Date(time * 1000);
    } else {
      // 处理13位时间戳（毫秒）
      date = new Date(time);
    }
  }

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', time);
    return String(time); // 如果无法解析，返回原始值的字符串形式
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };

  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // 注意: getDay() 返回 0 表示周日，1 表示周一，...
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    // 对月份、日期、小时、分钟、秒进行补零
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });

  return timeStr;
}

/**
 * 格式化时间为相对时间
 * @param {string|number|Date} time - 时间
 * @param {string} option - 选项
 * @returns {string} - 相对时间字符串
 */
export function formatTimeAgo(time, option) {
  if (!time) {
    return '未知时间';
  }

  const d = typeof time === 'object' ? time : new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // 小于1小时
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    // 小于24小时
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    // 小于48小时
    return '1天前';
  }

  if (option) {
    return parseTime(time, option);
  } else {
    // 超过2天，显示日期
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}月${day}日`;
  }
}

/**
 * 获取当前日期的字符串表示
 * @param {string} format - 格式化模板
 * @returns {string} - 当前日期的字符串表示
 */
export function getCurrentDate(format = '{y}-{m}-{d}') {
  return parseTime(new Date(), format);
}

/**
 * 日期加减计算
 * @param {string|Date} date - 基准日期
 * @param {number} days - 要加减的天数，正数为加，负数为减
 * @param {string} format - 返回格式
 * @returns {string} - 计算后的日期字符串
 */
export function addDays(date, days, format = '{y}-{m}-{d}') {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return parseTime(d, format);
}

export default {
  parseTime,
  formatTimeAgo,
  getCurrentDate,
  addDays
};
