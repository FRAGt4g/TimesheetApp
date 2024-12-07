import { Gatherer, initData, DataShape } from "../_layout"

const GatheriCloud: Gatherer = initData({
    title: "Gather iCloud...",
    gatherFunc: () => (new Promise<DataShape>(resolve => {
        setTimeout(() => {
            resolve({
                gatherType: "iCloud",
                information: {
                    other: {
                        moreStuff: "value",
                        hi: "value"
                    }
                }
            })
        }, 20)
    }))
})

export default GatheriCloud