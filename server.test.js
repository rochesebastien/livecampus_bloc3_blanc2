const request = require('supertest');
const app = require('./server');

describe('API Tests', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzIyMjQwOTI5LCJleHAiOjE3MjIzMjczMjl9.0MLgTGG8ph_ub3dCu0YLL5R_KRP1RCgr1lJfBZndNgY';

    beforeAll(async () => {
        // Inscription d'un utilisateur admin pour obtenir un token
        await request(app)
            .post('/api/signup')
            .send({ lastname: 'Admin', firstname: 'User', email: 'admin@example.com', password: 'password' });

        const res = await request(app)
            .post('/api/signin')
            .send({ email: 'admin@example.com', password: 'password' });

        token = res.body.token;
    });

    describe('POST /api/signup', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({ lastname: 'Doe', firstname: 'John', email: 'john@example.com', password: 'password' });

            expect(response.statusCode).toBe(201);
        });

        it('should not register a user with missing fields', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({ lastname: 'Doe', email: 'john@example.com', password: 'password' });

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST /api/signin', () => {
        it('should sign in a user', async () => {
            const response = await request(app)
                .post('/api/signin')
                .send({ email: 'john@example.com', password: 'password' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('auth', true);
        });

        it('should not sign in with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/signin')
                .send({ email: 'john@example.com', password: 'wrongpassword' });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /api/clients/count', () => {
        it('should get clients count with admin role', async () => {
            const response = await request(app)
                .get('/api/clients/count')
                .set('Cookie', `token=${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('count');
        });

        it('should not get clients count without token', async () => {
            const response = await request(app)
                .get('/api/clients/count');

            expect(response.statusCode).toBe(401);
        });
    });

    describe('POST /api/voitures', () => {
        it('should add a new car', async () => {
            const response = await request(app)
                .post('/api/voitures')
                .set('Cookie', `token=${token}`)
                .send({ marque: 'Toyota', modele: 'Corolla', plaque: 'ABC123', annee: 2020, client_id: 1 });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('message', 'Véhicule ajouté');
        });

        it('should not add a car without token', async () => {
            const response = await request(app)
                .post('/api/voitures')
                .send({ marque: 'Toyota', modele: 'Corolla', plaque: 'ABC123', annee: 2020, client_id: 1 });

            expect(response.statusCode).toBe(401);
        });
    });
});