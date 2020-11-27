const _ = require('lodash')

const getNameFromParts = ({ fontSize, fontFamily, fontWeight, text, textName }) => `${textName || text}-${fontFamily}-${fontSize}-${fontWeight}`
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
          const settings = {fontSize, fontFamily, fontWeight}
          const comboName = getNameFromParts({...settings, textName})
          newTestCase.combinations.push({name: comboName, ...settings})
        })
      })
      testCases.push(newTestCase)
    })
  })
})

module.exports = testCases


