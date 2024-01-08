const luminance = (r, g, b) => {
  var a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

const contrast = (rgb1, rgb2) => {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
  return (lum1 > lum2) ? (lum1 / lum2) : (lum2 / lum1);
}

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

const rgbToHex = (r, g, b) => '#' + [r, g, b]
  .map(x => x.toString(16).padStart(2, '0')).join('')

const getLightThemeColor = (lightBgRGB, themeColorRGB, contrastRatio) => {
  let i = themeColorRGB
  let safetyCounter = 0
  const maxIterations = 1000

  while (contrast(lightBgRGB, i) < contrastRatio) {
    if (safetyCounter++ > maxIterations) {
      throw new Error('Infinite loop detected and prevented');
    }

    i = i.map(c => c === 0 ? 1 : c * 0.99)
  }

  while (contrast(lightBgRGB, i) > contrastRatio) {
    if (safetyCounter++ > maxIterations) {
      throw new Error('Infinite loop detected and prevented');
    }

    i = i.map(c => c === 0 ? 1 : c * 1.01)
  }

  return i.map(c => parseInt(c)).map(c => c > 255 ? 255 : c)
}

const getDarkThemeColor = (darkBgRGB, themeColorRGB, contrastRatio) => {
  let i = themeColorRGB
  let safetyCounter = 0
  const maxIterations = 1000

  while (
    contrast(darkBgRGB, i) < contrastRatio
  ) {
    if (safetyCounter++ > maxIterations) {
      throw new Error('Infinite loop detected and prevented');
    }

    i = i.map(c => c === 0 ? 1 : c * 1.01)
  }

  while (
    contrast(darkBgRGB, i) > contrastRatio
  ) {
    if (safetyCounter++ > maxIterations) {
      throw new Error('Infinite loop detected and prevented');
    }

    i = i.map(c => c === 0 ? 1 : c * 0.99)
  }

  return i.map(c => parseInt(c)).map(c => c > 255 ? 255 : c)
}

const updateColor = () => {
  const lightBg = hexToRgb(document.getElementById('light-bg').value)
  const darkBg = hexToRgb(document.getElementById('dark-bg').value)
  const themeColor = hexToRgb(document.getElementById('theme-color').value)
  const contrastRatio = parseFloat(document.getElementById('contrast-ratio').value)
  document.getElementById('ratio-value').textContent = contrastRatio.toFixed(1)
  document.getElementById('result-light').style.backgroundColor = rgbToHex(lightBg[0], lightBg[1], lightBg[2])
  document.getElementById('result-dark').style.backgroundColor = rgbToHex(darkBg[0], darkBg[1], darkBg[2])

  const lightThemeColor = getLightThemeColor(lightBg, themeColor, contrastRatio)
  const darkThemeColor = getDarkThemeColor(darkBg, themeColor, contrastRatio)
  document.getElementById('result-light').style.color = rgbToHex(lightThemeColor[0], lightThemeColor[1], lightThemeColor[2])
  document.getElementById('result-light').innerText = rgbToHex(lightThemeColor[0], lightThemeColor[1], lightThemeColor[2])
  document.getElementById('result-dark').style.color = rgbToHex(darkThemeColor[0], darkThemeColor[1], darkThemeColor[2])
  document.getElementById('result-dark').innerText = rgbToHex(darkThemeColor[0], darkThemeColor[1], darkThemeColor[2])
}

updateColor()
document.getElementById('contrast-ratio').addEventListener('input', () => updateColor())
document.getElementById('light-bg').addEventListener('input', () => updateColor())
document.getElementById('dark-bg').addEventListener('input', () => updateColor())
document.getElementById('theme-color').addEventListener('input', () => updateColor())
