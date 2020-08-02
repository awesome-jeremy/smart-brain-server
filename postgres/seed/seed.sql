BEGIN TRANSACTION;

INSERT INTO users(name,email,entries,joined) values('Jeremy','root',100,'2020-08-01');
INSERT INTO login(hash, email) values('$2a$10$1ni.yCWljC.8xU7GDUol2ORWzp80F6xSgMI8DbfcIjSkssOwOtwve','root');

COMMIT;