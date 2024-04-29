import {memo, useState} from 'react';

const ShippingForm = memo(function ShippingForm({onSubmit}) {
    const [count, setCount] = useState(1);

    console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
    let startTime = performance.now();
    while (performance.now() - startTime < 500){

    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderDetails = {
            ...Object.fromEntries(formData),
            count
        };
        onSubmit(orderDetails);
    }

    return (
        <form onSubmit={handleSubmit}>
            <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
            <label>
                Number of items:
                <button type="button" onClick={() => setCount(count - 1)}>-</button>
                {count}
                <button type="button" onClick={() => setCount(count + 1)}>+</button>
            </label>
            <br />
            <br />
            <label>
                Street:
                <input name="street" />
                </label> 
                <br />
                <br />
                <label>
                    City:
                    <input name="city" />
                    </label> 
                    <br />
                    <br />      
                    <label>
                        postal code:
                        <input name="zipCode" />
                    </label>
                    <button type="Submit">Submit</button>
        </form>
    );
});

export default ShippingForm;