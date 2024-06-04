import { BigNumber } from "bignumber.js";

export const BigNumber0 = BigNumber.clone({
    DECIMAL_PLACES: 0,
    ROUNDING_MODE: BigNumber.ROUND_DOWN
});

/**
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function toBigNumber(_value) {
    return new BigNumber0(_value);
}

/**
 * @param {string} num
 * @param {number} decimals
 * @param {number} precision
 * @return {string}
 */
export function toBigNumberFloat(num, decimals = 18, delimiter = ".") {
    num = num.split("_").join("");
    if (num.split(delimiter).length === 1)
        return num.padEnd(decimals + num.split(delimiter)[0].length, "0");
    const intPart = num.split(delimiter)[0];
    const fracPart = num
        .split(delimiter)[1]
        .padEnd(decimals, "0")
        .slice(0, decimals);
    return intPart + fracPart;
}
/**
 * @param {string} num
 * @param {number} decimals
 * @param {number} precision
 * @return {string}
 */
export function formatStringFloat(
    num,
    decimals = 18,
    precision = 2,
    delimiter = "."
) {
    num = num.toString().padStart(decimals + 1, "0");
    const intPart = num.slice(0, -decimals).replace(/^0+/, "");
    const fracPart = num
        .slice(-decimals)
        .padEnd(precision, "0")
        .slice(0, precision);
    if (precision === 0) return intPart;
    return (
        (intPart ? intPart : "0") +
        (fracPart.length > 0 ? delimiter + fracPart : "")
    );
}

/**
 * Shift decimal point
 *
 * @param {string|number|BigNumber} _value
 * @param {number} [_dp]
 * @return {BigNumber}
 */
export function bShiftDP(_value, _dp = 18) {
    return toBigNumber(_value).shiftedBy(_dp);
}

/**
 * @param {string|number|BigNumber} value
 * @param {number} [decimals]
 * @return {BigNumber}
 */
export function bFromTokenValue(value, decimals = 18) {
    return bShiftDP(value, -decimals);
}

/**
 * @param {string|number|BigNumber} value
 * @param {number} [decimals]
 * @return {BigNumber}
 */
export function bToTokenValue(value, decimals = 18) {
    return bShiftDP(value, decimals);
}

/**
 * From Wei to Ether
 *
 * @param {string|number|BigNumber} value
 * @return {BigNumber}
 */
export function bFromWei(value) {
    return bFromTokenValue(value);
}

/**
 * From Ether to Wei
 *
 * @param {string|number|BigNumber} value
 * @return {BigNumber}
 */
export function bToWei(value) {
    return bToTokenValue(value);
}

/**
 * @param {string|number|BigNumber} _value
 * @return {string}
 */
export function toHex(_value) {
    // return web3utils.toHex(_value);
    return `0x${toBigNumber(_value).toString(16)}`;
}

/**
 * @param {string|number|BigNumber} _value
 * @return {number}
 */
export function toInt(_value) {
    return parseInt(toBigNumber(_value).toString(10));
}

Number.prototype.noExponents = function() {
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = "",
        sign = this < 0 ? "-" : "",
        str = data[0].replace(".", ""),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + "0.";
        while (mag++) z += "0";
        // return z + str.replace(/^\-/, "");
        return z + str;
    }
    mag -= str.length;
    while (mag--) z += "0";
    return str + z;
};
