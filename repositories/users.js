const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class UserRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;
        fs.accessSync(this.filename);
    } catch(err) {
        fs.writeFile(this.filename, '[]');
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename,
                { encoding: 'utf-8' }));
    };

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await fs.promises.writeFile(this.filename,
            JSON.stringify(records, null, 2));
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename,
            JSON.stringify(records, null, 2));
    }
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}

const test = async () => {
    const repo = new UserRepository('users.json');

    const users = await repo.getOne('1196b991');

    // const users = await repo.update('1196b991', { password: 'mypassword' });

    // await.repo.delete('1196b991');

    //await repo.getOneBy({ email, id})

    console.log(user);
};

test();