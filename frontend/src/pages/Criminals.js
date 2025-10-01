import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserX, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Criminals = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">CRIMINAL DATABASE</span>
          </h1>
          <p className="text-muted-foreground mt-1">Federal offender classification system</p>
        </div>
        <Link to="/criminals/add">
          <Button className="bg-secure-red hover:bg-secure-red/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </Link>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserX className="mr-2 h-5 w-5 text-secure-red" />
            Wanted Individuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UserX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Criminal Database Module</h3>
            <p className="text-muted-foreground mb-4">Advanced subject tracking system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Database
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Criminals;