import db from '../models/index';
let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing input parameter!!',
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errorCode: 0,
          errorMessage: 'OK',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data?.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, 'base64').toString('binary');
          return item;
        });
      }
      resolve({
        errorCode: 0,
        errorMessage: 'OK',
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errorCode: 1,
          errorMessage: 'Missing input parameter!!',
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ['descriptionHTML', 'descriptionMarkdown'],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === 'ALL') {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: inputId },
              attributes: ['doctorId', 'provinceId'],
            });
          } else {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ['doctorId', 'provinceId'],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
        }
        resolve({
          errorCode: 0,
          errorMessage: 'OK',
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewSpecialty,
  getSpecialty,
  getDetailSpecialtyById,
};
