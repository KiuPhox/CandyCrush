import Candy from '../objects/Candy'

export interface CandyRemoveSet {
    removeDelay: number
    candiesToRemove: Set<Candy>
}
