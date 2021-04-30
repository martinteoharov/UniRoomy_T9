// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// make it non anonymous to fix fast refresh issues
const named = (req, res) => {
    res.status(200).json({ test: 'John Doe' })
}

export default named;
