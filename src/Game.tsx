import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

const cardImageUrl = 'https://via.placeholder.com/125x175'

export default function Game() {
    return (
        <div className='game'>
            <Table />
        </div>
    )
}

function Table() {
    const [inPlacingMode, setInPlacingMode] = useState(false)

    return (
        <div className='game-table'>
            <div className='table-card-area'>
                <CardRow ownedByPlayer={false} inPlaceMode={inPlacingMode} />
                <CardRow ownedByPlayer={true} inPlaceMode={inPlacingMode} />
            </div>
            <PlayerCardCollection>
                <Card imageUrl={cardImageUrl} setInPlacingMode={setInPlacingMode} />
                <Card imageUrl={cardImageUrl} setInPlacingMode={setInPlacingMode} />
                <Card imageUrl={cardImageUrl} setInPlacingMode={setInPlacingMode} />
                <Card imageUrl={cardImageUrl} setInPlacingMode={setInPlacingMode} />
                <Card imageUrl={cardImageUrl} setInPlacingMode={setInPlacingMode} />
            </PlayerCardCollection>
            <CardDeck>
                <DummyCard imageUrl={cardImageUrl} />
                <DummyCard imageUrl={cardImageUrl} />
                <DummyCard imageUrl={cardImageUrl} />
                <DummyCard imageUrl={cardImageUrl} />
            </CardDeck>
        </div>
    )
}

function CardRow(props: { ownedByPlayer: boolean; inPlaceMode: boolean }) {
    return (
        <div className='table-card-row'>
            <CardPlaceholder highlighted={props.ownedByPlayer && props.inPlaceMode} />
            <CardPlaceholder highlighted={props.ownedByPlayer && props.inPlaceMode} />
            <CardPlaceholder highlighted={props.ownedByPlayer && props.inPlaceMode} />
            <CardPlaceholder highlighted={props.ownedByPlayer && props.inPlaceMode} />
            <CardPlaceholder highlighted={props.ownedByPlayer && props.inPlaceMode} />
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

function Card(props: { setInPlacingMode: Dispatch<SetStateAction<boolean>>; imageUrl: string }) {
    const [selected, setSelected] = useState(false)

    function OnClick() {
        setSelected(!selected)
    }

    useEffect(() => {
        props.setInPlacingMode(selected)
    }, [selected])

    return (
        <div
            className={`game-card ${selected ? 'selected dragging' : ''}`}
            onClick={OnClick}
            style={{
                backgroundImage: `url("${props.imageUrl}")`
            }}
        ></div>
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
