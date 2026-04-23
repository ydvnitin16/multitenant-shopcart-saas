import moongoose from "mongoose";

const addressSchema = new moongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        user: {
            type: moongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        country: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    { timestamps: true },
);

const Address = moongoose.model("Address", addressSchema);

export default Address;
