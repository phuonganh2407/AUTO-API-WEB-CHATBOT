import { getListAttribute } from "../../../services/api/productApi/attribute.api";

export async function checkListAttribute(payload: any): Promise<any> {
    //Lấy data name từ payload (Thường được gọi body tạo thuộc tính) => Mục đích là để kiểm tra sau khi tạo thuộc tính có tồn tại trong danh sách hay không
    const namePayload = payload.data.name;
    //Gọi API lấy danh sách thuộc tính
    const response = await getListAttribute();
    //Kiểm tra trong danh sách có tồn tại thuộc tính với name giống payload hay không
    const attributes = response.data.data || [];
    const exists = attributes.some((attr:any) => attr.name === namePayload);
    
    console.log(`Kiểm tra thuộc tính với name="${namePayload}" tồn tại trong danh sách: `, exists);
    return exists;
}