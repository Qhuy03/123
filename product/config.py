import json
import os
import random

cookies = {
    '_trackity': 'a76ff1d2-f8db-4626-59a1-d7c776a51dfd',
    'TOKENS':'{%22access_token%22:%228jUzhpkr9PNyOBJmTLCt02d1R3YuGfHq%22%2C%22expires_in%22:157680000%2C%22expires_at%22:1895317122434%2C%22guest_token%22:%228jUzhpkr9PNyOBJmTLCt02d1R3YuGfHq%22}',
    '_ga': 'GA1.1.1394004427.1737637126',
    'delivery_zone': 'Vk4wMzQwMjQwMTM=',
    '_gcl_au': '1.1.2018865452.1737637132',
    '_fbp': 'fb.1.1737637159631.910860957906806773',
    '__RC': '4',
    '__R': '1',
    '__iid': '749',
    '__iid': '749',
    '__su': '0',
    '__su': '0',
    'tiki_client_id': '1394004427.1737637126',
    '_hjSessionUser_522327': 'eyJpZCI6ImQ4MWViNTlmLThmOGUtNTg0MC1hNDcwLWQ1YjUxYmJjZDZmOSIsImNyZWF0ZWQiOjE3Mzc2MzcxNjE0MzEsImV4aXN0aW5nIjp0cnVlfQ==',
    '__tb': '0',
    '__IP': '712289952',
    '_hjSession_522327': 'eyJpZCI6IjRhODZmYzY2LTM0MTgtNDdhZC04NmVlLWQ0NWQ0NDA5Mzc4NSIsImMiOjE3Mzc4NzI0MDExNzksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=',
    '__uif': '__uid%3A1853543151746730570%7C__ui%3A-1%7C__create%3A1695354315',
    'cto_bundle': 'OMdNl18zRkZqRHZxN2FvTWNQMzBDQVY3Sk9uSlVJd1ZjUU9TMllzJTJGOFJMQTdDJTJGZnNjc285a3drTzdQMTE0bSUyRnNoejlPTUNpS2UzWjdScjBRbWdkbSUyQmdzNHFvd1hoNllEdzBwc04zNnMlMkJTTGUlMkZ2RDhDWHYxNG4lMkZ5bkVFSCUyQlluVk1pQkRLWWZQaXFWMyUyRno2MkY3V1NLeVQ4SElSekltSFlHOHVXSEdvUVJvVDMlMkJ2bGxUaDNVMTdEaHg0RkFPcDBoTHA5ajRlaEpOc3A1R0p3Q3pTMjI4Mm5CYkElM0QlM0Q',
    '_ga_S9GLR1RQFJ': 'GS1.1.1737878725.7.1.1737878838.53.0.0',
    'amp_99d374': '0LMNrV1MZyubCk0UXKbKke...1iigq9mp3.1iigqd7ba.cg.dq.qa'
}

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    'referer': 'https://tiki.vn/may-loc-khong-khi-o-to-cao-cap-boneco-p50-ion-am-lon-khuech-tan-xong-tinh-dau-dung-cho-xe-hoi-xe-day-em-be-ban-lam-viec-hang-nhap-khau-p7139355.html?itm_campaign=CTP_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.157091_Y.1713226_Z.2797625_CN.May-Loc-Khong-Khi%2C-Khu-Mui-xe--TO-BONECO-Thuy-Si-P50-Ion-am%2F-Khuech-Tan-Huong-Tinh-Dau---Hang-Nhap-Khau&itm_medium=CPC&itm_source=tiki-ads&spid=7139357',
    'x-guest-token': '8jUzhpkr9PNyOBJmTLCt02d1R3YuGfHq',
}

def transform_specifications_to_object(specifications):
    result = {}
    for spec in specifications:
        for attribute in spec["attributes"]:
            result[attribute["name"]] = attribute["value"]
    return result

def transform_configurable_options(configurable_options, price):
    if(configurable_options == None):
        return None, None


    product_variations = []
    
    for option in configurable_options:
        variation = {
            "name": option["name"],
            "options": [value["label"].strip() for value in option["values"]]
        }
        product_variations.append(variation)
    all_options = [variation["options"] for variation in product_variations]
    def generate_combinations(options, idx=0, current_combination=None):
        if current_combination is None:
            current_combination = []

        # Điều kiện dừng: Khi đã duyệt qua tất cả thuộc tính
        if idx == len(options):
            return [current_combination]

        # Tạo tổ hợp với tùy chọn hiện tại
        combinations = []
        for i, value in enumerate(options[idx]):
            combinations += generate_combinations(options, idx + 1, current_combination + [(idx, i)])
        return combinations
    
    combinations = generate_combinations(all_options)

    # Tạo sku_list từ các tổ hợp
    sku_list = [
        {
            "sku_tier_idx": [c[1] for c in combination],
            "sku_price": price,
            "sku_stock": random.randint(1000, 10000),
        }
        for combination in combinations
    ]

    return product_variations, sku_list

def getThumbnails(thumbs):
    thumbList = []
    for thumb in thumbs: 
        thumbList.append(thumb["base_url"])
    return thumbList

def saveToJsonFile(data, category, page):
    try:
        # Kiểm tra và tạo thư mục "data" nếu chưa tồn tại
        data_folder_path = 'data_2'
        if not os.path.exists(data_folder_path):
            os.makedirs(data_folder_path)  # Tạo thư mục "data" nếu chưa có

        # Kiểm tra và tạo thư mục category bên trong thư mục "data"
        folder_path = os.path.join(data_folder_path, str(category))
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)  # Tạo thư mục category nếu chưa có


        # Tạo tên file
        filename = f"{folder_path}/products_{category}_{page}.json"
        
        # Chuyển dữ liệu thành chuỗi JSON
        data_json = json.dumps(data, ensure_ascii=False, indent=4)

        # Mở file và ghi dữ liệu vào
        with open(filename, 'w', encoding='utf-8') as json_file:
            json_file.write(data_json)

        print(f"Dữ liệu đã được ghi vào file {filename}")

    except Exception as e:
        print(f"Đã xảy ra lỗi khi lưu file: {e}")


def saveToJsonFileError(data, category, path):
    try:
        data_folder_path = 'errors'
        if not os.path.exists(data_folder_path):
            os.makedirs(data_folder_path)

        # Kiểm tra và tạo thư mục category bên trong thư mục "data"
        folder_path = os.path.join(data_folder_path, str(category))
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)  # Tạo thư mục category nếu chưa có


        # Tạo tên file
        filename = f"{folder_path}/{path}.json"
        
        # Chuyển dữ liệu thành chuỗi JSON
        data_json = json.dumps(data, ensure_ascii=False, indent=4)

        # Mở file và ghi dữ liệu vào
        with open(filename, 'w', encoding='utf-8') as json_file:
            json_file.write(data_json)

        print(f"Dữ liệu đã được ghi vào file {filename}")

    except Exception as e:
        print(f"Đã xảy ra lỗi khi lưu file: {e}")


def loadFromJsonFile(filename):
    try:
        # Mở file và đọc dữ liệu
        with open(filename, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        return data
    except FileNotFoundError:
        print(f"File {filename} không tồn tại.")
        return None
    except json.JSONDecodeError:
        print(f"File {filename} không phải định dạng JSON hợp lệ.")
        return None