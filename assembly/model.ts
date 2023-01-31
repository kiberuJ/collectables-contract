import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

@nearBindgen
export class Coin {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    price: u128;
    owner: string;
    sold: u32;
    quantity: u32;
    public static fromPayload(payload: Coin): Coin {
        const coin = new Coin();
        coin.id = payload.id;
        coin.name = payload.name;
        coin.description = payload.description;
        coin.image = payload.image;
        coin.location = payload.location;
        coin.price = payload.price;
        coin.quantity = payload.quantity;
        coin.owner = context.sender;
        return coin;
    }
    public saleProcessing(orderedCoins: u32): void {
        this.sold = this.sold + orderedCoins;
        this.quantity = this.quantity - orderedCoins;
    }
}

export const listedCoins = new PersistentUnorderedMap<string, Coin>("CNS");