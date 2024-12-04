type Gatherer = {
    title: string,
    gatherFunc: () => DataShape
}

type DataShape = {
    status: string,
    gatherType: string,
    information: object
}

export type { DataShape, Gatherer }