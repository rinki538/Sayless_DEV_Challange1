import Button from './Button';

export default function GenerateButton({ loading }) {
  return (
    <Button type="submit" variant="primary" disabled={loading} className="w-full py-4 text-lg sm:w-auto sm:px-10">
      {loading ? 'Finding the words...' : 'Find My Words'}
    </Button>
  );
}
