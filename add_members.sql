-- Création des utilisateurs
INSERT INTO users (
    user_id, 
    username, 
    wallet_address, 
    email_verified,
    created_at,
    updated_at
) VALUES
('1d7b7c5e-e589-4a8a-b551-1a3d91d62ab7', 'Toyi', 'DZeqfBwUKKzKGqFxHQeNYqGsgqNxqz1RH8M5LGwqRvEp', true, NOW(), NOW()),
('2f8c8d6f-f67a-5b9b-c662-2b4ea2e73bc8', 'Jup', 'Hk2NVjxZqPgNqGVZ6VHNxmTyDkNEyWkpWZ4v1xM9Qx8j', true, NOW(), NOW()),
('3g9d9e7g-g78b-6c0c-d773-3c5fb3f84cd9', 'Nashotsu', '9XqNYDwGmQK8JV5KgmZjxvDvPjqEVZLs6WEzHRH3p1Zw', true, NOW(), NOW()),
('4h0e0f8h-h89c-7d1d-e884-4d6gc4g95de0', 'Sat', 'BvNdxqL5Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7h', true, NOW(), NOW()),
('5i1f1g9i-i90d-8e2e-f995-5e7hd5h06ef1', 'Kara', 'EpNqWxL8Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7k', true, NOW(), NOW()),
('6j2g2h0j-j01e-9f3f-g006-6f8ie6i17fg2', 'Ojama', 'FvNdxqL5Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7m', true, NOW(), NOW()),
('7k3h3i1k-k12f-0g4g-h117-7g9jf7j28gh3', 'Fleo', 'GpNqWxL8Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7n', true, NOW(), NOW()),
('8l4i4j2l-l23g-1h5h-i228-8h0kg8k39hi4', 'Ilessio', 'HvNdxqL5Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7p', true, NOW(), NOW()),
('9m5j5k3m-m34h-2i6i-j339-9i1lh9l40ij5', 'Or-Bor', 'IpNqWxL8Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7q', true, NOW(), NOW()),
('0n6k6l4n-n45i-3j7j-k440-0j2mi0m51jk6', 'Yazz', 'JvNdxqL5Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7r', true, NOW(), NOW()),
('1o7l7m5o-o56j-4k8k-l551-1k3nj1n62kl7', 'Di4x', 'KpNqWxL8Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7s', true, NOW(), NOW()),
('2p8m8n6p-p67k-5l9l-m662-2l4ok2o73lm8', 'PapaTij', 'LvNdxqL5Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7t', true, NOW(), NOW()),
('3q9n9o7q-q78l-6m0m-n773-3m5pl3p84mn9', 'Miky', 'MpNqWxL8Z1YkG8wQJ6mHnX4RjKZeP9XqLpW2vM3nQx7u', true, NOW(), NOW());

-- Ajout des membres à la DAO
INSERT INTO dao_members (dao_id, user_id, role)
SELECT '855361342354589303', user_id, 'member'
FROM users
WHERE username IN (
    'Toyi', 'Jup', 'Nashotsu', 'Sat', 'Kara', 'Ojama', 'Fleo',
    'Ilessio', 'Or-Bor', 'Yazz', 'Di4x', 'PapaTij', 'Miky'
);