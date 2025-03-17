import { defineStore } from "pinia"
import axios from 'axios'

export const useCryptoStore = defineStore('cryptoValue', {

    state: () => ({
        prices: {
            btc: {bid: null, ask: null},
            eth: {bid: null, ask: null},
            usdt: {bid: null, ask: null},
        },
            
}),
    actions: {

        async fetchPrices(){
            this.error = null
            try{
                
                const [btc, eth, usdt] = await Promise.all([
                    axios.get('https://criptoya.com/api/argenbtc/btc/ars'),
                    axios.get('https://criptoya.com/api/argenbtc/eth/ars'),
                    axios.get('https://criptoya.com/api/argenbtc/usdt/ars'),
            
                ])

                this.prices.btc = {bid: btc.data.totalBid, ask: btc.data.totalAsk}
                this.prices.eth = {bid: eth.data.totalBid, ask: eth.data.totalAsk}
                this.prices.usdt = {bid: usdt.data.totalBid, ask: usdt.data.totalAsk}
            }
            catch(error){
                this.error("Error al cargar las criptomonedas")
                console.log(error)

            }
        }
    }

})