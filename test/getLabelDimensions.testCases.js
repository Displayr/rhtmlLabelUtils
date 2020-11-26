const _ = require('lodash')

const addFontAttributesIfMissing = (testCase) => {
  if (!testCase.input.text) { testCase.input.text= 'label' }
  if (!testCase.input.fontSize) { testCase.input.fontSize = '10' }
  if (!testCase.input.fontFamily) { testCase.input.fontFamily = 'Arial' }
  if (!testCase.input.fontWeight) { testCase.input.fontWeight = 'normal' }
  if (!testCase.input.rotation) { testCase.input.rotation = '0' }
  return testCase
}

const addNameIfMissing = (testCase) => {
  if (!testCase.name) { testCase.name = getNameFromParts(testCase.input) }
  return testCase
}

const getNameFromParts = ({ fontSize, fontFamily, fontWeight, rotation, text, textName }) => `${textName || text}-${fontFamily}-${fontSize}-${fontWeight}-${rotation}`
const stripSpaces = (input) => input.replace(/ /g, '')

const fontSizes = [15,30,45,60]
const fontFamilies = ['Arial', 'Times New Roman', 'Fantasy']
const fontWeights = ['lighter', 'normal', 'bold', 'bolder']
const inputs = [
  { textName: 'simple', text: 'label' },
  { textName: 'many_words', text: 'label label label label label' },
  { textName: 'all_alphanumeric', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890' },
  { textName: 'specialCharacters', text: '!@#$%^&*()-_+=[{]}\\|?/.>,<~`"\'' },
]
const orientations = ['horizontal']

const testCases = []
orientations.forEach(orientation => {
  inputs.forEach(({textName, text}) => {
    fontFamilies.forEach(fontFamily => {
      const newTestCase = {text, name: stripSpaces(`${textName}-${fontFamily}`).toLowerCase(), combinations: []}
      fontSizes.forEach(fontSize => {
        fontWeights.forEach(fontWeight => {
          const settings = {fontSize, fontFamily, fontWeight, rotation: '0'}
          const comboName = getNameFromParts({...settings, textName})
          newTestCase.combinations.push({name: comboName, ...settings})
        })
      })
      testCases.push(newTestCase)
    })
  })
})

module.exports = testCases
  // .map(addFontAttributesIfMissing)
  // .map(addNameIfMissing)


