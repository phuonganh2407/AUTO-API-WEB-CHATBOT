export interface attributeBody {
  index: string;
  data: {
    attribute_name: string;
    name: string;
    values: string[];
    parent_class: string[];
  };
  meta_data: {
    processing_time: number;
    receive_time: number;
    response_time: number;
    status: number;
  };
}
