export interface IMatch {
    candies: Candy[]
    type: 'vertical' | 'horizontal' | 'wrapped'
}

export type Hint = IMatch | null
