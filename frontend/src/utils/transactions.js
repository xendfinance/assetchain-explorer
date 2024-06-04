import web3utils from "web3-utils";

const WEI_IN_FTM = 1000000000000000000;

export function toDivide(_value) {
    var value = _value.toString();
    var arr = value.split(".");
    var fractionPath = arr.length > 1 ? "." + value.split(".")[1] : "";
    var int = value.split(".")[0];
    if (int.length <= 3) return int + fractionPath;
    var space = 0;
    var number = "";

    for (var i = int.length - 1; i >= 0; i--) {
        if (space == 3) {
            number = "," + number;
            space = 0;
        }
        number = int.charAt(i) + number;
        space++;
    }

    return number + fractionPath;
}

/**
 * @return {number}
 */
export function WEIToFTM(_value) {
    return _value / WEI_IN_FTM;
}

/**
 * @return {number}
 */
export function FTMToWEI(_value) {
    return _value * WEI_IN_FTM;
}

/**
 * @param {*} _value
 * @param {number} [_tokenPrice]
 * @return {number}
 */
export function FTMToUSD(_value, _tokenPrice = 0.002) {
    return _value * _tokenPrice;
}

/**
 * Check if given string is transaction hash, address or block number.
 *
 * @return {'transaction_hash' | 'address' | 'block' | ''}
 */
export function getTypeByStr(_str) {
    let type = "";
    let num = 0;

    if (_str) {
        if (web3utils.isHexStrict(_str)) {
            if (_str.length === 66) {
                type = "transaction_hash";
                // } else if (web3utils.toChecksumAddress(_str)) {
            } else if (web3utils.isAddress(_str)) {
                type = "address";
            }
        } else {
            num = parseInt(_str);
            if (!isNaN(num)) {
                type = "block";
            }
        }
    }

    return type;
}
