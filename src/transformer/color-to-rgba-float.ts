import {toHex} from 'color2k'
import {isColor} from '../filter/isColor.js'
import {Transform, TransformedToken} from 'style-dictionary/types'
import {getValue} from '../utilities/getValue.js'

const toRgbaFloat = (color: string, alpha?: number) => {
  // get hex value from color string
  const hex = toHex(color)
  // retrieve spots from hex value (hex 3, hex 6 or hex 8)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex) ?? ['00', '00', '00', 'ff']
  // return parsed rgba float object using alpha value from token, from hex code or defaults to 1
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: alpha ?? (result[4] !== undefined ? parseInt(result[4], 16) / 255 : 1),
  }
}
// sum up the values of all values in an array
const sum = (array: unknown[]): number => array.reduce((acc: number, v: unknown) => acc + parseInt(`${v}`), 0)

const isRgbaFloat = (value: unknown) => {
  if (
    value &&
    typeof value === `object` &&
    'r' in value &&
    'g' in value &&
    'b' in value &&
    sum(Object.values(value)) < 5
  ) {
    return true
  }
  return false
}

/**
 * @description converts color tokens rgba float with values from 0 - 1
 * @type value transformer — [StyleDictionary.ValueTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens of $type `color`
 * @transformer returns a `rgb` float object
 */
export const colorToRgbaFloat: Transform = {
  name: 'color/rgbaFloat',
  type: `value`,
  transitive: true,
  filter: isColor,
  transform: (token: TransformedToken) => {
    const tokenValue = getValue<string>(token)
    // skip if value is already rgb float
    if (isRgbaFloat(tokenValue)) return tokenValue
    // convert hex or rgb values to rgba float
    return toRgbaFloat(tokenValue, token.alpha)
  },
}
