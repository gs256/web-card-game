import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

const cardImageUrl = 'https://via.placeholder.com/125x175'
const cardRowWidth = 5

export default function Game() {
    return (
        <div className='game'>
            <Table />
        </div>
    )
}

class CardPlaceholderModel {
    private _card: CardModel | null = null

    public get card(): CardModel | null {
        return this._card
    }

    public set card(value: CardModel | null) {
        this._card = value
    }

    public empty(): boolean {
        return this._card == null
    }
}

class CardModel {
    public selected: boolean = false
    public tempText: string = ''

    constructor(tempText: string) {
        this.tempText = tempText
    }
}

function Table() {
    const [inPlacingMode, setInPlacingMode] = useState(false)
    const [playerCardRow, setPlayerCardRow] = useState(getEmptyCardRow)
    const [enemyCardRow, setEnemyCardRow] = useState(getEmptyCardRow())
    const [playerCardCollection, setPlayerCardCollection] = useState([
        new CardModel('card 1'),
        new CardModel('card 2'),
        new CardModel('card 3'),
        new CardModel('card 4'),
        new CardModel('card 5')
    ] as CardModel[])

    useEffect(() => {
        setInPlacingMode(playerCardCollection.findIndex((card) => card.selected) >= 0)
    }, [playerCardCollection])

    function getEmptyCardRow(): CardPlaceholderModel[] {
        const result: CardPlaceholderModel[] = []
        for (let i = 0; i < cardRowWidth; i++) result.push(new CardPlaceholderModel())
        return result
    }

    function changeSelection(selected: boolean, key: number) {
        setPlayerCardCollection(
            playerCardCollection.map((card, index) => {
                if (selected) card.selected = index == key
                else card.selected = false
                return card
            })
        )
    }

    return (
        <div className='game-table'>
            <div className='table-card-area'>
                <CardRow cardRow={enemyCardRow} ownedByPlayer={false} inPlaceMode={inPlacingMode} />
                <CardRow cardRow={playerCardRow} ownedByPlayer={true} inPlaceMode={inPlacingMode} />
            </div>
            <PlayerCardCollection>
                {playerCardCollection.map((card, index) => (
                    <Card
                        selected={card.selected}
                        changeSelection={(selected) => changeSelection(selected, index)}
                        key={index}
                        interactable={true}
                        tempText={card.tempText}
                        imageUrl={cardImageUrl}
                    />
                ))}
            </PlayerCardCollection>
            <CardDeck>
                <Card
                    selected={false}
                    interactable={false}
                    tempText={'dummy'}
                    imageUrl={cardImageUrl}
                />
                <Card
                    selected={false}
                    interactable={false}
                    tempText={'dummy'}
                    imageUrl={cardImageUrl}
                />
                <Card
                    selected={false}
                    interactable={false}
                    tempText={'dummy'}
                    imageUrl={cardImageUrl}
                />
                <Card
                    selected={false}
                    interactable={false}
                    tempText={'dummy'}
                    imageUrl={cardImageUrl}
                />
                <Card
                    selected={false}
                    interactable={false}
                    tempText={'dummy'}
                    imageUrl={cardImageUrl}
                />
            </CardDeck>
        </div>
    )
}

function CardRow(props: {
    cardRow: CardPlaceholderModel[]
    ownedByPlayer: boolean
    inPlaceMode: boolean
}) {
    return (
        <div className='table-card-row'>
            {props.cardRow.map((placeholder, index) => (
                <CardPlaceholder highlighted={props.ownedByPlayer && props.inPlaceMode} />
            ))}
        </div>
    )
}

function CardPlaceholder(props: { highlighted: boolean }) {
    return (
        <div className={`table-card-placeholder${props.highlighted ? ' highlighted' : ''}`}></div>
    )
}

function CardDeck(props: { children?: ReactNode }) {
    return (
        <div className='table-card-deck'>
            <div className='card-deck-card-container'>{props.children}</div>
        </div>
    )
}

function Card(props: {
    tempText: string
    imageUrl: string
    interactable: boolean
    selected: boolean
    changeSelection?: (selected: boolean) => void
}) {
    // const [selected, setSelected] = useState(false)
    const [hovered, setHovered] = useState(false)

    function onClick() {
        props.changeSelection?.(!props.selected)
    }

    function onMouseEnter() {
        setHovered(true)
    }

    function onMouseLeave() {
        setHovered(false)
    }

    return (
        <div
            className={`game-card ${props.selected ? 'selected' : ''} ${
                hovered ? 'zoomed-in' : ''
            } ${props.interactable ? 'interactable' : ''}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                backgroundImage: `url("${props.imageUrl}")`
            }}
        >
            {props.tempText}
        </div>
    )
}

function DummyCard(props: { imageUrl: string }) {
    return (
        <div
            className='game-card'
            style={{
                backgroundImage: `url("${props.imageUrl}")`
            }}
        ></div>
    )
}

function PlayerCardCollection(props: { children?: ReactNode[] }) {
    return (
        <div className={'table-player-card-collection-container'}>
            <div className='table-player-card-collection'>
                {props.children?.map((child, index) => (
                    <div key={index} style={{ marginRight: '10px', marginLeft: '10px' }}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    )
}
