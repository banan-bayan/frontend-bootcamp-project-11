import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string('notString').required('empty').url('notValidUrl'),
});

export default (fields) => schema.validate(fields)
  .catch((err) => {
    throw new yup.ValidationError(err);
  });
