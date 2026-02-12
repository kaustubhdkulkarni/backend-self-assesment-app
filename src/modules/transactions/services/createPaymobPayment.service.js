const { default: axios } = require('axios');
const { db } = require('../../../db/db');
const moment = require('moment');

const createPaymobPayment = async ({ user, transactionPayload, items }) => {
	try {
		// let totalAmount = 0;
		// if (items.length) {
		// 	for (const item of items) {
		// 		totalAmount += parseFloat(item?.amount / 1000) * parseFloat(item?.quantity);
		// 	}
		// }
		// console.log("itemsPrice:", items[0]?.amount);

		// let amount = (totalAmount * 1000);
		// console.log("amount:", amount);

		console.log(moment().format(), { transactionPayload });
		console.log("Expiry:", moment().add(30, "minutes").format("YYYY-MM-DD HH:mm:ss"));

		let paymobPayload2 = JSON.stringify({
			amount: Math.round(transactionPayload?.amountToPayInUSD * 1000),  // amount_cents must be equal to the sum of the items amounts
			currency: transactionPayload?.currency || "OMR",
			payment_methods: process.env.NODE_ENV === 'production' ? [
				Number(process.env.PAYMOB_INTEGRATION_ID),
				Number(process.env.PAYMOB_INTEGRATION_ID_OMANNET),
			]
				: [
					Number(process.env.PAYMOB_INTEGRATION_ID),
				], //Enter your integration ID as an Integar, you can list multiple integration IDs as -> "payment_methods": [{{Integration_ID_1}}, {{Integration_ID_2}}, {{Integration_ID_3}}], so the user can choose the payment method within the checkout page

			items: items,
			billing_data: {
				apartment: "NA",
				email: user?.email,
				floor: "NA",
				building: "NA",
				first_name: user?.firstName || "NA",
				last_name: user?.lastName || "NA",
				phone_number: user?.phone || "+123456789",
				street: "NA",
				city: "NA",
				country: "OM",
				state: "NA",
				postal_code: "00000",
			},

			extras: {
				billing_data: {
					apartment: "NA",
					email: user?.email,
					floor: "NA",
					building: "NA",
					first_name: user?.firstName || "NA",
					last_name: user?.lastName || "NA",
					phone_number: user?.phone || "+123456789",
					street: "NA",
					city: "NA",
					country: "OM",
					state: "NA",
					postal_code: "00000",
				},
			},
		})
		console.log("paymobPayload2:",paymobPayload2);
		

		let response2 = await axios.request({
			method: 'post',
			// maxBodyLength: Infinity,
			url: `${process.env.PAYMOB_BASE_URL}/v1/intention/`,
			data: paymobPayload2,
			headers: {
				'Authorization': `Token ${process.env.PAYMOB_SECRET_KEY}`,
				'Content-Type': 'application/json'
			}
		});
		console.log("intention_order_id:", response2?.data?.intention_order_id);
		let checkoutURL = null;

		checkoutURL = `${process.env.PAYMOB_BASE_URL}/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${response2?.data?.client_secret}`;

		// Save transaction details to the database
		transactionPayload['transactionSession'] = response2?.data?.intention_order_id;
		transactionPayload['expiryAt'] = moment.unix(Math.floor(Date.now() / 1000) + 30 * 60);
		transactionPayload['checkoutURL'] = checkoutURL;
		const addResult = await db.Transaction.create(transactionPayload);

		if (addResult) {
			return {
				status: true,
				code: 201,
				data: {
					checkoutURL: checkoutURL,
				},
			};
		}
	} catch (error) {
		console.error("Error while creating Paymob checkout URL:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = createPaymobPayment;