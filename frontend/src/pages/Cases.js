import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Cases = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">CASE FILES DATABASE</span>
          </h1>
          <p className="text-muted-foreground mt-1">Classified federal investigation records</p>
        </div>
        <Link to="/cases/add">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Case File
          </Button>
        </Link>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Active Investigations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Case Files Module</h3>
            <p className="text-muted-foreground mb-4">Advanced case management system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Cases
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

export default Cases;