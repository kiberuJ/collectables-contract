import { Coin, listedCoins } from './model';

import { ContractPromiseBatch, context } from 'near-sdk-as';

export function setCoin(coin: Coin): void {
    let storedCoin = listedCoins.get(coin.id);
    if (storedCoin !== null) {
        throw new Error(`a coin with ${coin.id} already exists`);
    }
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
    if (coin.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposit should equal to the coin's price");
    }
    ContractPromiseBatch.create(coin.owner).transfer(context.attachedDeposit);
    coin.saleProcessing(orderedCoins);
    listedCoins.set(coin.id, coin);
}

export function deleteCoin(coinId: string): void {
    const coin = getCoin(coinId);
    if (coin == null) {
        throw new Error("Entry not found!");
    } else {
        listedCoins.delete(coinId);
    }
}

export function clearListing(): void {
    listedCoins.clear();
}

export function entriesLength(): i32 {
    return listedCoins.length;
}