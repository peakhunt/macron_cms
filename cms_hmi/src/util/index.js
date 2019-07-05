const dateformat = require('dateformat');

function getAlarmStateStr(state) {
  switch (state) {
    case 0: return 'Inactive';
    case 1: return 'Active Pending';
    case 2: return 'Inactive Pending';
    case 3: return 'Active';
    default:
      break;
  }

  return 'Unknown';
}

function getAlarmTime(ts) {
  const time = new Date(ts);

  return dateformat(time, 'yyyy-mm-dd HH:MM:ss');
}

const alarmColors = {
  minor: 'yellow',
  major: 'orange',
  critical: 'red',
};

const alarmSeverityNum = {
  normal: -1,
  minor: 0,
  major: 1,
  critical: 2,
};

const alarmTextColor = {
  normal: {
    text: '#ffffff',
    back: '#000000',
  },
  minor: {
    text: '#000000',
    back: '#ffff00',
  },
  major: {
    text: '#ffffff',
    back: '#ffa500',
  },
  critical: {
    text: '#ffffff',
    back: '#ff0000',
  },
};

/**
 * @param arg {object}
 * {
 *   unit,
 *   title,
 *   min,
 *   max,
 *   width,
 *   height,
 *   minTicks,
 *   majorTicksInterval,
 *   highlights,
 * }
 */
function createRadialGaugeOption(arg) {
  const opt = {
    units: arg.unit,
    colorUnits: '#fff',
    title: arg.title,
    colorTitle: '#fff',
    colorNumbers: '#fff',
    minValue: arg.min,
    maxValue: arg.max,
    width: arg.width,
    height: arg.height,
    strokeTicks: true,
    colorBar: 'transparent',
    colorBarProgress: 'blue',
    highlights: [
      {
        from: 0,
        to: 100,
        color: '#00E676',
      },
      {
        from: 100,
        to: 220,
        color: '#FFFF8D',
      },
      {
        from: 220,
        to: 320,
        color: '#FF3D00',
      },
    ],
    minorTicks: arg.minTicks,
    majorTicks: [],
    colorPlate: 'transparent',
    borderShadowWidth: 0,
    borders: false,
    needleType: 'arrow',
    needleShadow: true,
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    numberSide: 'left',
    needleSide: 'left',
    animationDuration: 25,
    animationRule: 'linear',
    barWidth: 0,
    valueBox: true,
    valueBoxStroke: 5,
    valueTextShadow: true,
    valueInt: 3,
    valueDec: 2,
    barBeginCircle: 0,
    fontTitleSize: 25,
    fontNumbersSize: 18,
    fontUnitsSize: 20,
    fontValueSize: 30,
    colorValueText: alarmTextColor.normal.text,
    colorValueBoxBackground: alarmTextColor.normal.back,
  };

  opt.highlights = JSON.parse(JSON.stringify(arg.highlights));

  for (let i = 0; i <= opt.maxValue; i += arg.majorTicksInterval) {
    opt.majorTicks.push(i);
  }

  return opt;
}

/**
 * @param arg {object}
 * {
 *   unit,
 *   title,
 *   min,
 *   max,
 *   width,
 *   height,
 *   minTicks,
 *   majorTicksInterval,
 *   highlights,
 * }
 */
function createLinearGaugeOption(arg) {
  const opt = {
    units: arg.unit,
    colorUnits: '#fff',
    title: arg.title,
    colorTitle: '#fff',
    colorNumbers: '#fff',
    minValue: arg.min,
    maxValue: arg.max,
    width: arg.width,
    height: arg.height,
    strokeTicks: true,
    colorBar: 'white',
    colorBarProgress: 'blue',
    highlights: [],
    minorTicks: 10,
    majorTicks: [],
    colorPlate: 'transparent',
    borderShadowWidth: 0,
    borders: false,
    needleType: 'arrow',
    needleShadow: true,
    needleWidth: 4,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    numberSide: 'left',
    needleSide: 'center',
    animationDuration: 25,
    animationRule: 'linear',
    barWidth: 15,
    valueBox: true,
    valueBoxStroke: 5,
    valueInt: 2,
    valueDec: 3,
    valueTextShadow: true,
    barBeginCircle: false,
    fontTitleSize: 18,
    fontNumbersSize: 18,
    fontUnitsSize: 20,
    fontValueSize: 30,
    colorValueText: alarmTextColor.normal.text,
    colorValueBoxBackground: alarmTextColor.normal.back,
  };

  opt.highlights = JSON.parse(JSON.stringify(arg.highlights));

  for (let i = 0; i <= opt.maxValue; i += arg.majorTicksInterval) {
    opt.majorTicks.push(i);
  }

  return opt;
}

function getBiggerAlarmSeverity(a, b) {
  const an = alarmSeverityNum[a];
  const bn = alarmSeverityNum[b];

  return an > bn ? a : b;
}

module.exports = {
  getAlarmStateStr,
  getAlarmTime,
  alarmColors,
  createRadialGaugeOption,
  createLinearGaugeOption,
  getBiggerAlarmSeverity,
  alarmTextColor,
};
