import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100, // Số lượng Virtual Users (VUs) cùng chạy
  duration: '60s', // Thời gian chạy test
  // stages: [
  //   { duration: '1m', target: 2000 },
  //   { duration: '1m', target: 2000 },
  // ],
};

export default function () {
  // URL API
  const randomPage = Math.floor(Math.random() * 100) + 1;
  // const url = 'http://localhost:8080/users?page=1&perPage=20';
  const url = `http://host.docker.internal:8080/users?page=${randomPage}&perPage=20`;

  // Gửi request GET
  const response = http.get(url);
  // Ghi log hoặc kiểm tra response nếu cần
  // console.log(`Status: ${response.status}, Response time: ${response.timings.duration} ms`);
  check(response, {
    'is status 200': (r) => r.status === 200,
  });
//   sleep(1); // Nghỉ 1 giây trước khi gửi request tiếp theo
}
