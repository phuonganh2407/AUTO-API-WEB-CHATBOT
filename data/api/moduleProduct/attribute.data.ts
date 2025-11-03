import { faker } from "@faker-js/faker";
import { attributeBody } from "../../../object/api/serviceProductObject/attribute.api.object";

export async function fullAttributesData(): Promise<Partial<attributeBody>>{
    return {
        index: "string",
        data: {
            attribute_name: "string",
            name: faker.lorem.words(2),
            values: [],
            parent_class: []
        },
        meta_data: {
            processing_time: 0,
            receive_time: 0,
            response_time: 0,
            status: 0
        }
    };
}