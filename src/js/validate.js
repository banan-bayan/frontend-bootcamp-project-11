import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string('is not a string').required('must dont empty').url(),
});

export default (fields) => schema.validate(fields)
  .catch(() => {
    throw new Error('URL is notValid');
  });
