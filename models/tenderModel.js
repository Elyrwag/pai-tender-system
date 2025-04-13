const { DataTypes, Op } = require('sequelize');
const sequelize = require('../databases/db');

const Tender = sequelize.define('Tender', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    budget: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
}, {
    tableName: 'tenders'
});

const Offer = sequelize.define('Offer', {
    bidder_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    offer_value: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    tender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'offers',
    timestamps: false
});

// Relation: tender has many offers
Tender.hasMany(Offer, { foreignKey: 'tender_id' });
Offer.belongsTo(Tender, { foreignKey: 'tender_id' });

exports.getAllActiveTenders = async () => {
    return await Tender.findAll({
        where: {
            end_date: {
                [Op.gt]: new Date() // date greater than now - so future date
            }
        }
    });
};

exports.getEndedTenders = async () => {
    return await Tender.findAll({
        where: {
            end_date: {
                [Op.lte]: new Date() // date less than or equal now - so past date or now
            }
        }
    });
};

exports.getTenderById = async (id) => {
    return await Tender.findByPk(id, { raw: true } ); // raw: true - only current values
};

exports.addOffer = async (tenderId, bidderName, offerValue) => {
    const tender = await Tender.findByPk(tenderId);
    if (!tender) { throw new Error('Tender does not exist'); }

    return await Offer.create({
        tender_id: tenderId,
        bidder_name: bidderName,
        offer_value: offerValue
    });
};

exports.createTender = async (tenderData) => {
    return Tender.create(tenderData);
};

exports.getOffersByTenderId = async (tenderId) => {
    const tender = await this.getTenderById(tenderId);
    if (!tender) throw new Error('Tender not found');

    return await Offer.findAll({
        where:  {
            tender_id: tenderId,
            offer_value: {
                [Op.lte]: tender.budget
            }
        } ,
        order: [['offer_value', 'ASC']], // sorted by value (from lowest to highest)
        raw: true // only current values
    });
};
