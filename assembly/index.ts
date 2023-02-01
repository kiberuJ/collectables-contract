import { Coin, listedCoins } from './model';

import { ContractPromiseBatch, context } from 'near-sdk-as';

export function setCoin(coin: Coin): void {
    let storedCoin = listedCoins.get(coin.id);
    if (storedCoin !== null) {
        throw new Error(`a coin with ${coin.id} already exists`);
    }
    assert(coin.description.length > 0, "Empty description");
    assert(coin.name.length > 0, "Empty name");
    assert(coin.image.length > 0, "Empty image");
    assert(coin.location.length > 0, "Empty location");
    listedCoins.set(coin.id, Coin.fromPayload(coin));
}

export function getCoin(id: string): Coin | null {
    return listedCoins.get(id);
}

export function getCoins(): Coin[] {
    return listedCoins.values();
}

export function buyCoin(coinId: string, orderedCoins: u32): void {
    const coin = getCoin(coinId);
    if (coin == null) {
        throw new Error("coin not found");
    }
    assert(orderedCoins <= coin.quantity, "Ordered amount can't be fulfilled");
    const amountOrdered = u128.mul(coin.price, u128.from(orderedCoins));
    assert(amountOrdered.toString() == context.attachedDeposit.toString(), "Attached amount doesn't match total cost of order");
    ContractPromiseBatch.create(coin.owner).transfer(context.attachedDeposit);
    coin.saleProcessing(orderedCoins);
    listedCoins.set(coin.id, coin);
}

export function deleteCoin(coinId: string): void {
    const coin = getCoin(coinId);
    if (coin == null) {
        throw new Error("Entry not found!");
    } else {
        assert(coin.owner.toString() == context.sender, "Unauthorized sender");
        listedCoins.delete(coinId);
    }
}

export function clearListing(): void {
    listedCoins.clear();
}

export function entriesLength(): i32 {
    return listedCoins.length;
}