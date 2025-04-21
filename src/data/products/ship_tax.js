// 税费与运费数据 - 自动生成，请勿手动修改
export default {
  "shipping": [
    {
      "template_id": 3,
      "platform_id": 1,
      "template_name": "22221",
      "default_fee": 3,
      "free_shipping_limit": null,
      "create_time": "2025-03-23 12:09:54",
      "update_time": "2025-03-23 12:09:54",
      "rules": []
    },
    {
      "template_id": 2,
      "platform_id": 1,
      "template_name": "11112",
      "default_fee": 5,
      "free_shipping_limit": null,
      "create_time": "2025-03-23 11:55:06",
      "update_time": "2025-03-23 11:55:06",
      "rules": [
        {
          "rule_id": 3,
          "template_id": 2,
          "region_id": 1,
          "first_unit": 1,
          "first_fee": 5,
          "additional_unit": 1,
          "additional_fee": 6,
          "condition_type": "weight",
          "condition_value": null,
          "create_time": "2025-03-23 11:55:28",
          "update_time": "2025-03-23 11:55:28",
          "region_name": "塞浦路斯"
        },
        {
          "rule_id": 4,
          "template_id": 2,
          "region_id": 2,
          "first_unit": 1,
          "first_fee": 6,
          "additional_unit": 1,
          "additional_fee": 8,
          "condition_type": "weight",
          "condition_value": null,
          "create_time": "2025-03-23 11:59:25",
          "update_time": "2025-03-23 11:59:25",
          "region_name": "非塞浦路斯"
        }
      ]
    }
  ],
  "tax": [
    {
      "template_id": 1,
      "platform_id": 1,
      "template_name": "批发产品",
      "default_tax_rate": 17,
      "create_time": "2025-03-23 12:31:17",
      "update_time": "2025-03-23 12:32:53",
      "rules": [
        {
          "rule_id": 1,
          "template_id": 1,
          "region_id": 1,
          "tax_rate": 16,
          "create_time": "2025-03-23 12:31:31",
          "update_time": "2025-03-23 12:32:31",
          "region_name": "塞浦路斯"
        },
        {
          "rule_id": 3,
          "template_id": 1,
          "region_id": 2,
          "tax_rate": 19,
          "create_time": "2025-03-23 12:32:04",
          "update_time": "2025-03-23 12:32:04",
          "region_name": "非塞浦路斯"
        }
      ]
    }
  ]
};
