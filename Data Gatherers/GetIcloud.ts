import { Gatherer, DataShape } from "./_layout"

const GatherIcloud: Gatherer = {
    title: "Gather ICloud...",
    gatherFunc: () => {
        return {
            status: "done",
            gatherType: "Icloud",
            information: {
                something: "value",
            }
        }
    }
}

export default GatherIcloud