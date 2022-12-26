export default function validateCreateAccount(values) {
  let errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  }

  if (!values.company) {
    errors.company = 'Company name is required';
  }

  if (!values.url) {
    errors.url = 'URL is required';
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = 'URL is not valid';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  }

  return errors;
}
