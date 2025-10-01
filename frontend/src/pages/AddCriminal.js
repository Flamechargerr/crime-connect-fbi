import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserX, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const AddCriminal = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/criminals">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Database
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">SUBJECT REGISTRATION</span>
          </h1>
          <p className="text-muted-foreground mt-1">Add new individual to criminal database</p>
        </div>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserX className="mr-2 h-5 w-5 text-secure-red" />
            Subject Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UserX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Subject Registration Interface</h3>
            <p className="text-muted-foreground mb-4">Advanced subject profiling system under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCriminal;