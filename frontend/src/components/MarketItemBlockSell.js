import React from "react"
import ShoppingBasket from "../images/shopping-basket.svg"
import Dislike from "../images/thumb-down-outline-symbol.svg"
import Fade from "@material-ui/core/Fade/Fade";
import Sausage from "../images/sausage-icon.svg"

import egg from "../images/egg.png"
import kitkat from "../images/kitkat.jpeg"
import heinzbeans from "../images/heinz.png"
import peanutbutter from "../images/peanutbutter.jpeg"
import chocolatepowder from "../images/chocolatepowder.png"

const products = {
    100:heinzbeans,
    101:egg,
    102:kitkat,
    103:chocolatepowder,
    104:peanutbutter
}
class ItemBlock extends React.Component {
    state = {
        open: false,
    }

    render() {
        const {qr_code, seller,food_name,count, expiry_date,units,price, sale} = this.props
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "calc(100% - 10px)",
                marginTop: 5,
                marginBottom: 5,
                borderRadius: 5,
                alignItems: "center",
                background: this.state.open?'#fff':"#f9f7fa",
                boxShadow:this.state.open?'0px 1px 2px rgba(72,84,92,0.2)':undefined,
                paddingTop:15,
                transition:'0.5s'

            }}
                 onClick={()=>this.setState({open:!this.state.open})}
            >
                <div style={{display: 'flex', width: "100%"}}>
                    <img
                        src={products[qr_code]}
                        style={{
                            background: "#000",
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginLeft: 20,
                            marginRight: 10,
                            marginBottom: 5,
                            marginTop: 5,
                        }}
                    />
                    <div
                        style={{display: "flex", flexDirection: "column", height: 45, justifyContent: "space-between", flex: 1}}>
                        <div style={{color: "#515961", display: 'flex', width: '100%'}}>
                            {food_name} ({count} {units})
                            <div style={{ flex: 1 }} />
                            <span style={{color:'#0b54ff',fontWeight:800,marginRight:5}}>${price}</span>
                        </div>
                        <div style={{fontSize: 14, color: "#d4d5d8", marginRight: 8}}>{seller}</div>
                    </div>
                    <div style={{color: "#5d1ebe", fontSize: 10, marginLeft: 10, marginRight: 20}}>

                        {this.props.day || '2 Days'}
                    </div>
                </div>
                {this.state.open&&
                <Fade in out timeout={500}>
                    <div
                        style={{
                            width:"100%",
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center"
                        }}
                        onClick={e=>e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: "flex",
                                width: "calc(100% - 50px)",
                                marginTop: 20

                            }}
                        >
                            <div>
                                <img src={ShoppingBasket} width={20} height={20} style={{marginRight: 5}} alt=""/>
                                07 June 2018
                            </div>
                            <div style={{flex: 1}}/>
                            <div>
                                <img src={Dislike} width={20} height={20} style={{marginRight: 5}} alt=""/>
                                {expiry_date}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "calc(100% - 50px)",
                                marginTop: 15,
                                marginBottom: 15,
                                justifyContent: "space-between",
                            }}
                        >
                            <button style={{
                                flex: 1,
                                fontSize: 18,
                                height: 40,
                                borderRadius: 25,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border:"1.5px solid #0b54ff"
                            }}
                                    onClick={()=>this.props.handler(sale)}
                            >
                                <img src={Sausage} style={{width: 25, height: 25}} alt=""/>
                                <span style={{marginLeft: 10, color:"#0b54ff"}}>Buy</span>
                            </button>
                        </div>
                    </div></Fade>}
            </div>
        )
    }
}

export default ItemBlock