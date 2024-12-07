import { DataShape, Gatherer, initData } from "../_layout"

const GatherEmail: Gatherer = initData({
    title: "Gather Email...",
    gatherFunc: () =>  {
        return new Promise<DataShape>(resolve => {
            setTimeout(() => {
                resolve({
                    gatherType: "Email",
                    information: {
                        something: "value",
                        other: {
                            moreStuff: "value",
                            hi: "value"
                        }
                    }
                })
            }, 5000)
        })
    }
})

export default GatherEmail