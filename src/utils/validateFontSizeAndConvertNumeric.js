module.exports = fontSizeStringOrNumber => {
  if (!`${fontSizeStringOrNumber}`.match(/^[\d.]+(px)?$/)) {
    throw new Error(`Invalid fontSize '${fontSizeStringOrNumber}'. Must be numeric with optional trailing 'px'. (em|rem) not supported`)
  }
  return (typeof fontSizeStringOrNumber === 'number') ? fontSizeStringOrNumber : parseFloat(fontSizeStringOrNumber.replace(/px$/,''))
}