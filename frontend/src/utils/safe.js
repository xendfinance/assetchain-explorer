export const safe = async (promise, muteError = false) => {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        if (!muteError) {
            console.error(error);
            console.trace("Error Safe");
        }
        return [null, error];
    }
};

export const safeWrite = async (txPromise, muteError = false, timeout = 90) => {
    const [tx, errorTx] = await safe(txPromise, muteError);

    if (!tx) {
        console.log(errorTx);
        return [null, null];
    }

    const [rpt, error] = await safe(
        Promise.race([
            tx.wait(),
            new Promise(res => {
                setTimeout(() => res(null), timeout * 1000);
            })
        ]),
        muteError
    );

    if (!rpt) {
        console.log(error);
        return [null, null];
    }

    // const response = await Promise.race([tx.wait(), new Promise()])
    return [tx, rpt];
};
