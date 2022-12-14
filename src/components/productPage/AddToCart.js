import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import CartContext from '../../context/cartContext'
import { useRouter } from 'next/router'

export default function AddToCart({ id, available }) {

  const router = useRouter()
  
  const { cartBadgeToggle, setCartBadgeToggle } = useContext(CartContext)

  const [ selectedAmount, setSelectedAmount ] = useState(1)
  const [ isProductInCart, setIsProductInCart ] = useState(false)
  const [ amountInCart, setAmountInCart ] = useState(null)

  const checkIfProductIsInCart = () => {
    if (localStorage.getItem('cartList') === null) {
      setIsProductInCart(false)
    } else {

      const cartList = JSON.parse(localStorage.cartList)
      const isProductAlreadyInCart = cartList.find(i => i.id === id)      

      if (isProductAlreadyInCart === undefined) {
        setIsProductInCart(false)
      } else {
        const amountInCart = isProductAlreadyInCart.selectedAmount

        setAmountInCart(amountInCart)
        setIsProductInCart(true)
      }
    }
  }

  const chooseAmount = () => setSelectedAmount(parseInt(document.getElementById("items").value)) 

  const addToCart = async (id, selectedAmount) => {    
    const addedProduct = { id, selectedAmount }

    let cartList

    if (localStorage.getItem('cartList') === null) {
      cartList = []
      cartList.push(addedProduct)
      localStorage.setItem('cartList', JSON.stringify(cartList))
    } else {
      cartList = JSON.parse(localStorage.cartList)
      cartList.push(addedProduct)
      localStorage.setItem('cartList', JSON.stringify(cartList))
    }

    setAmountInCart(selectedAmount)
    setIsProductInCart(true)
    setCartBadgeToggle(!cartBadgeToggle)
  }

  const cancelAdding = id => {
    const cartList = JSON.parse(localStorage.cartList)
    const filteredCartList = cartList.filter(i => i.id !== id)

    localStorage.setItem('cartList', JSON.stringify(filteredCartList))

    setIsProductInCart(false)
    setCartBadgeToggle(!cartBadgeToggle)
  }

  let options = []
  
  for (let i = 1; i <= available; i++) {
    options.push(<option value={i} key={i}>{i}</option>)
  }

  useEffect(() => {
    checkIfProductIsInCart()
  }, [router.asPath]) // triggers on route change - we need this to refresh <isProductInCart> state (inside checkIfProductIsInCart() function) to correctly show addToCart button (because this useEffect is not triggering when we transition between /product-page/[id].js routes (throught "You might also like" section))

  return (
    <AddToCartDiv className="add-to-cart">
      <h3 className="button-wrapper-h3">
        {
          available <= 0
          ? (
            <div className="out-of-stock">
              <h3 className="out-of-stock-text text-danger">
                OUT OF STOCK!
              </h3>
            </div>
          ) 
          : available > 0 && isProductInCart 
          ? (
            <div>
              <h6>
                <button type="button" className="btn btn-warning" onClick={() => cancelAdding(id)}>
                  Added (cancel)
                </button>
              </h6>
            </div>
          ) : (
            <div>
              <label htmlFor="items">
                In stock:&nbsp;
                <select id="items" onChange={() => chooseAmount()}>
                  {options}
                </select>
              </label>
              <h6>
                <button 
                  type="button"
                  className="btn btn-warning" 
                  onClick={() => addToCart(id, selectedAmount)}
                >
                  Add to cart
                </button>
              </h6>
            </div>
          )
        }
      </h3>
      {
        isProductInCart
        ? (
          <div className="in-cart-amount">
            <span>In cart: {amountInCart}</span>
          </div>
        ) : (
          <div className="invisible"></div>
        )          
      }
    </AddToCartDiv>
  )
}

const AddToCartDiv = styled.div`
  grid-area: 3 / 2 / 4 / 3;
  display: flex;
  align-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 1em;
  > .button-wrapper-h3 > div {
    display: flex;
    flex-direction: column;
    > h6 > button {
      margin-right: 1em;
    }
  }
  > .button-wrapper-h3 > .out-of-stock {
    position: relative;
    height: 100px;
    width: 100px;
    > .out-of-stock-text {
      position: absolute;
      top: 6px;
      left: 5px;
      transform: rotate(14deg);
    }
  }
  > .in-cart-amount {
    background: #dc3545;
    color: white;
    margin: 0 1.5em 0 1.5em;
    padding: .2em .5em .2em .5em;
    border-radius: 5px;
  }
`
