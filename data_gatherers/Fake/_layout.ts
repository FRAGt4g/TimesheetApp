import 'react-native-get-random-values';
import { v4 as UUID } from 'uuid';

type Gatherer = {
    id: string,
    title: string,
    gatherFunc: () => DataShape
}

type DataShape = {
    status: string,
    gatherType: string,
    information: object,
}

export const initData = ({ 
    title, 
    gatherFunc 
}: { 
    title: string; 
    gatherFunc: () => DataShape
}): Gatherer => ({
    id: UUID(),
    title: title,
    gatherFunc: gatherFunc,
})

export type { DataShape, Gatherer }